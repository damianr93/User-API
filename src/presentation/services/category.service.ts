import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";



export class CategoryService {

    constructor(){}

    async createCategory ( createCategoryDto: CreateCategoryDto, user: UserEntity ) {

        const categoryExists = await CategoryModel.findOne({name: createCategoryDto.name});
        if( categoryExists ) throw CustomError.badRequest('category already exists');

        try {
            
            const category = new CategoryModel({
                ...createCategoryDto,
                user:user.id
            });

            await category.save()
  
            return {
                id: category.id,
                name: category.name,
                available: category.available
            };

        } catch (error) {
            throw CustomError.internarlServer(`${error}`)
        };

    };

    async getCategories( paginationDto: PaginationDto ) {

        const { page, limit } = paginationDto;

        try {

            const [ total,categories ] = await Promise.all([
                await CategoryModel.countDocuments(),
                await CategoryModel.find()
                .skip( (page - 1) * limit )
                .limit( limit ) 
            ])

                return {
                    page:page,
                    limit:limit,
                    total:total,

                    categories:categories.map(category => ({
                            id: category.id,
                            name: category.name,
                            available: category.available
                    }))
                    
                }
            

        } catch (error) {
          
            throw CustomError.internarlServer('Internal server error');
            
        };

    };

};