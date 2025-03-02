use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};
use spl_associated_token_account::get_associated_token_address;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod miro_token {
    use super::*;

    // 初始化代币铸造账户
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let mint = &mut ctx.accounts.mint;
        let payer = &ctx.accounts.payer;

        // 设置铸造权限为程序 PDA
        let auth_bump = *ctx.bumps.get("mint_authority").unwrap();
        let auth_seeds = &[b"mint-auth", &[auth_bump]];
        let signer = &[&auth_seeds[..]];

        // 初始化代币元数据
        token::initialize_mint(
            ctx.accounts.into_init_mint_context(),
            0, // decimals
            &ctx.accounts.mint_authority.key(),
            None, // freeze authority
        )?;

        Ok(())
    }

    // 领取代币函数
    pub fn claim_tokens(ctx: Context<ClaimTokens>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        let clock = Clock::get()?;

        // 检查是否为新的一天
        if user_state.last_claim_day != clock.unix_timestamp / 86400 {
            user_state.claims_today = 0;
            user_state.last_claim_day = clock.unix_timestamp / 86400;
        }

        // 检查领取限制
        require!(user_state.claims_today < 2, ErrorCode::ClaimLimitExceeded);

        // 铸造代币
        let amount = 2 * 10u64.pow(ctx.accounts.mint.decimals as u32);
        let auth_bump = *ctx.bumps.get("mint_authority").unwrap();
        let seeds = &[b"mint-auth", &[auth_bump]];
        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            signer,
        );

        token::mint_to(cpi_ctx, amount)?;

        // 更新用户状态
        user_state.claims_today += 1;
        user_state.total_claims += 1;

        Ok(())
    }
}

// 初始化上下文
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        mint::decimals = 6,
        mint::authority = mint_authority,
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [b"mint-auth"],
        bump
    )]
    /// CHECK: PDA 授权账户
    pub mint_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// 领取代币上下文
#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(
        init_if_needed,  // 重放攻击风险
        payer = user,
        space = 8 + 8 + 8 + 8,
        seeds = [b"user-state", user.key().as_ref()],
        bump,
        // 添加以下保护措施
        // constraints = user_state.discriminator == [0; 8], // 确保是新账户
        has_one = user @ ErrorCode::InvalidUser // 验证用户关联
    )]
    pub user_state: Account<'info, UserState>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(
        seeds = [b"mint-auth"],
        bump
    )]
    /// CHECK: PDA 授权账户
    pub mint_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// 用户状态账户
#[account]
pub struct UserState {
    pub discriminator: [u8; 8], // 固定值如 [255; 8]
    pub last_claim_day: i64,    // 上次领取天数（unix时间戳/86400）
    pub claims_today: u8,       // 今日已领取次数
    pub total_claims: u32,      // 总领取次数
}

#[error_code]
pub enum ErrorCode {
    #[msg("Daily claim limit exceeded")]
    ClaimLimitExceeded,
}
