import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const newPokemon = await this.pokemonModel.create(createPokemonDto);
      // return createPokemonDto;
      return newPokemon
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException(`Pokemon already exists in db, ${ JSON.stringify(err.keyValue) }`);
      } else {
        throw new InternalServerErrorException(`Can't create pokemon`)
      }
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOneByNo(no: number) {
    let browsedPokemon: Pokemon;

    if (!isNaN(no)) {
      browsedPokemon = await this.pokemonModel.findOne({ no: no })
    }

    if (!browsedPokemon) throw new NotFoundException(`not found Pokemon with no ${no}`)

    return browsedPokemon
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
