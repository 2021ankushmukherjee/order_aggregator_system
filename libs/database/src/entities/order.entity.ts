
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum OrderStatus {
    NEW = "NEW",
    IN_PROGRESS = "IN_PROGRESS",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

@Entity({ name: "ORDER" })
export class OrderEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productId: string;

    @Column()
    quantity: number;

    @Column({default: OrderStatus.NEW})
    status: string;

    @CreateDateColumn()
    _createdAt: Date;

    @UpdateDateColumn()
    _updatedAt: Date;
}