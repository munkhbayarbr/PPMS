import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

type Range = { from?: Date; to?: Date };

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private inRange(field: string, { from, to }: Range) {
    if (!from && !to) return {};
    if (from && to) return { [field]: { gte: from, lte: to } };
    if (from) return { [field]: { gte: from } };
    return { [field]: { lte: to! } };
  }

  // Work-In-Process: counts by stage in the time window
  async wip(range: Range) {
    const [p1, p2d, p2b, p3, p4, p5, p6, p7] = await Promise.all([
      this.prisma.p1Stock.count({ where: this.inRange('dateTime', range) }),
      this.prisma.p2Dyeing.count({ where: this.inRange('dateTime', range) }),
      this.prisma.p2Blending.count({ where: this.inRange('dateTime', range) }),
      this.prisma.p3Carding.count({ where: this.inRange('dateTime', range) }),
      this.prisma.p4Spinning.count({ where: this.inRange('dateTime', range) }),
      this.prisma.p5Winding.count({ where: this.inRange('dateTime', range) }),
      this.prisma.p6Doubling.count({ where: this.inRange('dateTime', range) }),
      this.prisma.p7Twisting.count({ where: this.inRange('dateTime', range) }),
    ]);

    return { window: range, counts: { p1, p2Dyeing: p2d, p2Blending: p2b, p3, p4, p5, p6, p7 } };
  }

  // Throughput (kg): sums of output-ish fields by stage
  async throughput(range: Range) {
    const [p2d, p3, p4, p5, p6, p7] = await Promise.all([
      this.prisma.p2Dyeing.aggregate({
        _sum: { p2FiberWeight: true },
        where: this.inRange('dateTime', range),
      }),
      this.prisma.p3Carding.aggregate({
        _sum: { p3RovenWeight: true },
        where: this.inRange('dateTime', range),
      }),
      this.prisma.p4Spinning.aggregate({
        _sum: { p4RovenWeight: true, p4DanUtas: true },
        where: this.inRange('dateTime', range),
      }),
      this.prisma.p5Winding.aggregate({
        _sum: { p5OroosonUtas: true },
        where: this.inRange('dateTime', range),
      }),
      this.prisma.p6Doubling.aggregate({
        _sum: { p5DavharUtas: true },
        where: this.inRange('dateTime', range),
      }),
      this.prisma.p7Twisting.aggregate({
        _sum: { p5BelenUtas: true },
        where: this.inRange('dateTime', range),
      }),
    ]);

    return {
      window: range,
      kg: {
        p2Dyeing_out: p2d._sum.p2FiberWeight ?? 0,
        p3Carding_out: p3._sum.p3RovenWeight ?? 0,
        p4Spinning_roven: p4._sum.p4RovenWeight ?? 0,
        p4Spinning_singleYarn: p4._sum.p4DanUtas ?? 0,
        p5Winding_out: p5._sum.p5OroosonUtas ?? 0,
        p6Doubling_out: p6._sum.p5DavharUtas ?? 0,
        p7Twisting_out: p7._sum.p5BelenUtas ?? 0,
      },
    };
  }

  // Waste (kg) by stage where available
  async waste(range: Range) {
    const [p2d, p3, p4] = await Promise.all([
      this.prisma.p2Dyeing.aggregate({
        _sum: { p2Waste: true },
        where: this.inRange('dateTime', range),
      }),
      this.prisma.p3Carding.aggregate({
        _sum: { p3Waste: true },
        where: this.inRange('dateTime', range),
      }),
      this.prisma.p4Spinning.aggregate({
        _sum: { p4Waste: true },
        where: this.inRange('dateTime', range),
      }),
    ]);

    return {
      window: range,
      kg: {
        p2Dyeing: p2d._sum.p2Waste ?? 0,
        p3Carding: p3._sum.p3Waste ?? 0,
        p4Spinning: p4._sum.p4Waste ?? 0,
      },
    };
  }
}
