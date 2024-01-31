import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto} from "../../domain";



export class ProductService {

    constructor(){}

    async createProduct ( createProductDto: CreateProductDto) {

        const productExists = await ProductModel.findOne({name: createProductDto.name});
        if( productExists ) throw CustomError.badRequest('Product already exists');

        try {
            
            const product = new ProductModel({
                ...createProductDto,
            });

            await product.save()
  
            return product;

        } catch (error) {
            throw CustomError.internarlServer(`${error}`)
        };

    };

    async getProduct( paginationDto: PaginationDto ) {

        const { page, limit } = paginationDto;

        try {

            const [ total,products ] = await Promise.all([
                await ProductModel.countDocuments(),
                await ProductModel.find()
                .skip( (page - 1) * limit )
                .limit( limit ) 
                .populate('category')
                .populate('user')
                // .populate('user', 'name email')
            ]);

            return {
            
                page:page, 
                limit:limit,
                total:total,
                
                products: products
                
            };
            

        } catch (error) {
          
            throw CustomError.internarlServer('Internal server error');
            
        };

    };

};