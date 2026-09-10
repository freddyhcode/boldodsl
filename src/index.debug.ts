import { Lexer } from "./lexer/lexer.js";

Lexer.debug(`
database ecommerce {

    # This is a comment
    table users {
        id: int primary key increment
        username: string
        age: int
        balance: decimal not null
        active: boolean
        birth_date: date
        created_at: datetime
    }

    table orders {
        id: int primary key
        user_id: int not null
        total: decimal
    }

    ref orders.user_id -> users.id one:many
} 
`);
