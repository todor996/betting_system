import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user";

@Table({
    timestamps: false,
    tableName: "bet",
})
export class Bet extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,

    })
    userId!: number;

    @BelongsTo(() => User)
    user!: User;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    betAmount!: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    chance!: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    payout!: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    win!: boolean;
}
