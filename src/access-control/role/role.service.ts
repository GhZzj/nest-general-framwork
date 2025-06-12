import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient as MysqlClient} from 'prisma-mysql';

@Injectable()
export class RoleService {
  @Inject("PRISMA_CLIENT")
  private prisma: MysqlClient;
  async create(createRoleDto: CreateRoleDto) {
    const existRole = await this.prisma.role.findUnique({
      where:{
        name:createRoleDto.name
      } 
    })
    if(existRole) throw new BadRequestException('角色已存在');
    return this.prisma.$transaction(async (prisma:MysqlClient)=>{
      const {permissions,...roleObj} = createRoleDto
      return prisma.role.create({
        data:{
          ...roleObj,
          rolePermissions:{
            create:permissions.map(permission=>({
              permission:{
                connectOrCreate:{
                  where:{
                    name:permission.name
                  },
                  create:{
                    ...permission
                  }
                }
              }
            }))
          }
        }
      })
    })
  }

  findAll(page=1,pageSize=10) {
    let skip = (page-1)*pageSize
    return this.prisma.role.findMany({
      skip,
      take:pageSize
    })
  }
  
  findOne(id: number) {
    return this.prisma.role.findUnique({
      where:{id},
      include:{
        rolePermissions:{
          select:{
            permission:true
          }
        }
      }
    })
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.prisma.role.update({
      where:{ id },
      data:updateRoleDto
    })
  }

  remove(id: number) {
    return this.prisma.role.delete({
      where:{
        id
      }
    })
  }
}
