import { PacketCodecBuilder } from "../../packet_codec.ts";

import { varInt } from "../../fields/var_int.ts";
import { buildMCString } from "../../fields/mc_string.ts";
import { ushort } from "../../fields/ushort.ts";

export const handshake = new PacketCodecBuilder(0x00, "handshake")
  .addField("version", varInt)
  .addField("address", buildMCString(255))
  .addField("port", ushort)
  .addField("nextState", varInt)
  .validate(value => value > 0 && value <= 2)
  .compile((ctx) => {
    ctx.state = ctx.packet.nextState;
  });
