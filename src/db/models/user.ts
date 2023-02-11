import { Table, Model, Column, DataType, HasMany} from "sequelize-typescript";
import {Bet} from "./bet";

@Table({
    timestamps: false,
    tableName: "user",
})
export class User extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    balance!: number;

    @HasMany(() => Bet)
    bets!: Bet[];
}
