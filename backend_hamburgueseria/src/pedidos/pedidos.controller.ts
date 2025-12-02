import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get('cliente/:idCliente')
  findByCliente(@Param('idCliente') idCliente: number) {
    return this.pedidosService.findByCliente(idCliente);
  }

  @Get('estado/:estado')
  findByEstado(@Param('estado') estado: string) {
    return this.pedidosService.findByEstado(estado);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(+id, updatePedidoDto);
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: number, @Body() body: { estado: string }) {
    return this.pedidosService.updateEstado(id, body.estado);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(+id);
  }
}
