pub mod miro_token;

use anchor_lang::prelude::*;

declare_id!("675F9mt7hPzUoZqetQxyGqH8kHYdrgTUxmKiBQkDBJz5");

#[program] // <-- 这个属性标识区块链程序
pub mod anchor {
    use super::*; // 这里 super 指向外部的根模块

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
