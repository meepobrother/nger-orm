import { Select, Delete, Insert, Update, Column, LeftJoin, Entity } from './decorator'

`
select * from member m 
	left join room_member r on r."memberId" = m.id
	left join room rm on rm.id = r."roomId"
	where m.id > 0
`

class Author { }

@Entity(`user`)
class User {
    @Column(`user_name`)
    name: string;

    @LeftJoin(`author a`)
    authro: Author
}
export class AuthUser {

}

export class UserDao {
    @Select(`select * from user where id=$1`)
    getUser: (id: number) => Promise<User & AuthUser>;

    @Delete("delete from tb_user where id=#$1")
    deleteUserById: (id: number) => Promise<void>;

    @Insert("insert into tb_user(name,sex) values($1,$2)")
    insertUser: (user: User) => Promise<void>;

    @Update("update tb_user set name=$1,sex=$2 where id=$3")
    updateUser: (user: User) => Promise<void>;

    @Select("select * from tb_user")
    getAllUsers: () => Promise<User[]>;
}
