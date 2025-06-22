import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: "STOCK" })
export class StockEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productId: string;

    @Column({default: 0})
    quantity: number;

    @CreateDateColumn()
    _createdAt: Date;

    @UpdateDateColumn()
    _updatedAt: Date;
}