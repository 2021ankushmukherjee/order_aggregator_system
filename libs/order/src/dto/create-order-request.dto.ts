import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderRequestDto {

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;
}
