import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "VENDOR_STOCK" })
export class VendorStockEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    vendor: string;

    @Column()
    productId: string;

    @Column({default: 0})
    quantity: number;

    @CreateDateColumn()
    _createdAt: Date;

    @UpdateDateColumn()
    _updatedAt: Date;

}