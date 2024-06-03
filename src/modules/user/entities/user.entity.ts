import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../../shared/enums/role.enum';
import { dateTransformer } from '../../../shared/utils/db-type.transformer';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'username' })
  username!: string;

  @Column({ name: 'password' })
  password!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({
    name: 'date_of_birth',
    type: 'date',
    transformer: dateTransformer,
  })
  dateOfBirth!: Date;

  @Column({ name: 'role', type: 'varchar' })
  role!: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
