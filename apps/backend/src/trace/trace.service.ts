import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TraceService {
  constructor(private prisma: PrismaService) {}

  async traceByLot(lotNum: string) {
    // P2 dyeing & blending can both produce lotNum in your schema.
    const p2d = await this.prisma.p2Dyeing.findMany({
      where: { lotNum },
      include: {
        fromP1: { include: { p1: true } }, // P1ToP2
        toP3:   { include: { p3: true } }, // P2ToP3
        color:  true,
        operator: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dateTime: 'asc' },
    });

    const p2b = await this.prisma.p2Blending.findMany({
      where: { lotNum },
      include: {
        color: true,
        operator: { select: { id: true, name: true, email: true } },
        // If you later add P2B->P3 join, include it here as well
      },
      orderBy: { dateTime: 'asc' },
    });

    // collect all P3 reached from P2D (and later P2B if added)
    const p3Ids = Array.from(
      new Set(p2d.flatMap(d => d.toP3.map(t => t.p3Id)))
    );

    const p3c = await this.prisma.p3Carding.findMany({
      where: { id: { in: p3Ids }, lotNum },
      include: {
        operator: { select: { id: true, name: true } },
        toP4: { include: { p4: true } }, // P3ToP4
      },
      orderBy: { dateTime: 'asc' },
    });

    const p4Ids = p3c.flatMap(c => c.toP4.map(x => x.p4Id));
    const p4s = await this.prisma.p4Spinning.findMany({
      where: { id: { in: p4Ids } },
      include: {
        operator: { select: { id: true, name: true } },
        toP5: { include: { p5: true } },
      },
      orderBy: { dateTime: 'asc' },
    });

    const p5Ids = p4s.flatMap(s => s.toP5.map(x => x.p5Id));
    const p5w = await this.prisma.p5Winding.findMany({
      where: { id: { in: p5Ids } },
      include: {
        operator: { select: { id: true, name: true} },
        toP6: { include: { p6: true } },
      },
      orderBy: { dateTime: 'asc' },
    });

    const p6Ids = p5w.flatMap(w => w.toP6.map(x => x.p6Id));
    const p6d = await this.prisma.p6Doubling.findMany({
      where: { id: { in: p6Ids } },
      include: {
        operator: { select: { id: true, name: true } },
        toP7: { include: { p7: true } },
      },
      orderBy: { dateTime: 'asc' },
    });

    const p7Ids = p6d.flatMap(d => d.toP7.map(x => x.p7Id));
    const p7t = await this.prisma.p7Twisting.findMany({
      where: { id: { in: p7Ids } },
      include: {
        operator: { select: { id: true, name: true } },
      },
      orderBy: { dateTime: 'asc' },
    });

    return {
      lotNum,
      sources: {
        p2Dyeing: p2d,
        p2Blending: p2b,
      },
      flow: {
        p3Carding: p3c,
        p4Spinning: p4s,
        p5Winding: p5w,
        p6Doubling: p6d,
        p7Twisting: p7t,
      },
    };
  }
}
