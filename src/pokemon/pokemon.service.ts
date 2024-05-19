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
      this.handleExceptions(err, 'create')
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

  async update(no: number, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemonToUpdate: Pokemon = await this.pokemonModel.findOne({ no: no })

    if (!pokemonToUpdate) throw new NotFoundException(`not found Pokemon with no ${no}`)

    if (updatePokemonDto.name) 
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
    
    try {
      await pokemonToUpdate.updateOne(updatePokemonDto, { new: true })
      // return `This action updates a #${no} pokemon`;
      return { ...pokemonToUpdate.toJSON(), ...updatePokemonDto }
    } catch (err) {
      this.handleExceptions(err, 'update')
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }

  private handleExceptions (err: any, method: string) {
    if (err.code === 11000) {
      throw new BadRequestException(`Pokemon with this data already exists in db, ${ JSON.stringify(err.keyValue) }`);
    } else {
      throw new InternalServerErrorException(`Can't ${ method } pokemon`)
    }
  }
}
