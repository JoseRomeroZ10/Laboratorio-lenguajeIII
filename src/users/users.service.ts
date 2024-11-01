import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ROLES } from 'src/common/enums/UserRole';
import { GENDER } from 'src/common/enums/UserGender';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllUsers } from './interfaces/responseAllUsers';
import { ResponseUsers } from './interfaces/responseUsers';

@Injectable()
export class UsersService {

  private users: UserEntity[] = [
    {id:1 , name:"carlos" , age: 24 , photo:"photo1" , email:"carlos@email.com" , password: "12345678",role: ROLES.USER, gender: GENDER.MALE, isActive: true},
    {id:2 , name:"jose" , age:20 , photo:"photo2" , email: "jose@email.com", password: "12345678",role: ROLES.USER, gender: GENDER.MALE, isActive: true},
    {id:3 , name:"mariana" , age:19 , photo:"photo3", email: "mariana@email.com", password: "12345678",role: ROLES.USER, gender: GENDER.FEMALE, isActive: true}
  ]

  create(createUserDto: CreateUserDto) {
      const user: UserEntity = {
        id: this.users.length + 1,
        ...createUserDto,
        role: ROLES.USER,
        isActive: true,
      }
      try {
        this.users.push(user);
  
        return user;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

 async findAll(paginationDto: PaginationDto): Promise< ResponseAllUsers > {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      if (this.users.length === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Users not found!',
        })
      }

      const total = this.users.filter((user) => user.isActive === true).length;
      const lastPage = Math.ceil(total / limit);
      const data = this.users.filter((user) => user.isActive === true).slice(skip, limit);
      const dataResponse = data.map((users) => {
      const {password, ...user} = users
        return user
      })

      return {
        page,
        limit,
        lastPage,
        total,
        dataResponse
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
    
  }

 async findOne(id: number): Promise< ResponseUsers > {
  try {
    const user = this.users.find((user) => user.id === id && user.isActive === true);
    if (!user) {
      throw new ManagerError({
        type: 'NOT_FOUND',
        message: "User not found",
      })
    }

    const {password, ...userResponse} = user

    return userResponse 
  } catch (error) {
    ManagerError.createSignatureError(error.message);
  }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const indexUser = this.users.findIndex((user) => user.id === id && user.isActive === true);
      if (indexUser === -1) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      this.users[indexUser] = {
        ...this.users[indexUser],
        ...updateUserDto,
      }
      return this.users[indexUser]
    } catch (error) {
      ManagerError.createSignatureError(error.message);
  }
}

  async remove(id: number): Promise< UserEntity > {
    try {
      const indexUser = this.users.findIndex((user) => user.id === id && user.isActive === true);
      if (indexUser === -1) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'user not found',
        });
      }

      this.users[indexUser] = {
        ...this.users[indexUser],
        isActive: false,
      }

      return this.users[indexUser]
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
