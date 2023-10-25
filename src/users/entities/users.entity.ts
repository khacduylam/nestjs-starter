import { Column, Entity } from 'typeorm';
import { UserGender, UserRole } from '../users.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { DBTable } from 'src/common/constants/db.constant';

@Entity({ name: DBTable.User })
export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ default: UserRole.USER })
  role: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: UserGender.UNSET })
  sex: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true, default: false })
  emailVerified: boolean;
}
