// import { PrismaClient, OrderStatus, ProcessStatus, StageType, MoveDir, WasteType, IoKind, ReservationStatus } from '@prisma/client'

// const prisma = new PrismaClient()

// async function main() {
//   console.log('🌱 Seeding PPMS data...')

//   // --- Roles ---
//   const [managerRole, operatorRole, storekeeperRole] = await prisma.role.createManyAndReturn({
//     data: [
//       { name_en: 'Manager', name_mn: 'Менежер' },
//       { name_en: 'Operator', name_mn: 'Оператор' },
//       { name_en: 'Storekeeper', name_mn: 'Нярав' },
//     ],
//   })

//   // --- Employees ---
//   const manager = await prisma.employee.create({
//     data: {
//       name: 'Manager Munkhbayar',
//       email: 'manager@ppms.local',
//       password_hash: 'hashed-password',
//       roles: { create: [{ role_id: managerRole.id }] },
//     },
//   })

//   const operator = await prisma.employee.create({
//     data: {
//       name: 'Operator Bat',
//       email: 'operator@ppms.local',
//       password_hash: 'hashed-password',
//       roles: { create: [{ role_id: operatorRole.id }] },
//     },
//   })

//   const storekeeper = await prisma.employee.create({
//     data: {
//       name: 'Storekeeper Enkh',
//       email: 'storekeeper@ppms.local',
//       password_hash: 'hashed-password',
//       roles: { create: [{ role_id: storekeeperRole.id }] },
//     },
//   })

//   // --- Reference tables ---
//   await prisma.fiberType.createMany({
//     data: [
//       { id: 'wool', name: 'Ноос' },
//       { id: 'cashmere', name: 'Ноолуур' },
//     ],
//   })

//   await prisma.color.createMany({
//     data: [
//       { id: 'white', name: 'Цагаан' },
//       { id: 'grey', name: 'Саарал' },
//     ],
//   })

//   await prisma.bobbin.createMany({
//     data: [
//       { name: 'Standard 150g', weight_g: 150 },
//       { name: 'Light 100g', weight_g: 100 },
//     ],
//   })

//   // --- Factory processes ---
//   const processes = await prisma.factoryProcess.createManyAndReturn({
//     data: [
//       { code: 'P1_RECEIVING', name_en: 'Receiving', name_mn: 'Хүлээн авах' },
//       { code: 'P2_DYEING', name_en: 'Dyeing', name_mn: 'Будах' },
//       { code: 'P3_BLENDING', name_en: 'Blending', name_mn: 'Холих' },
//       { code: 'P4_CARDING', name_en: 'Carding', name_mn: 'Самнах' },
//       { code: 'P5_SPINNING', name_en: 'Spinning', name_mn: 'Ээрэх' },
//       { code: 'P6_WINDING', name_en: 'Winding', name_mn: 'Ороох' },
//       { code: 'P7_TWISTING', name_en: 'Twisting', name_mn: 'Эрчлэх' },
//       { code: 'P8_SHIPPING', name_en: 'Shipping', name_mn: 'Тээвэрлэлт' },
//     ],
//   })

//   // --- Rules (io_rule + waste_rule) ---
//   for (const p of processes) {
//     await prisma.ioRule.createMany({
//       data: [
//         { process_id: p.id, kind: IoKind.INPUT, stage: StageType.FIBER },
//         { process_id: p.id, kind: IoKind.OUTPUT, stage: StageType.SINGLE_YARN },
//       ],
//     })
//     await prisma.wasteRule.createMany({
//       data: [
//         { process_id: p.id, waste: WasteType.CLEAN_OCHES },
//         { process_id: p.id, waste: WasteType.ERCHTEI },
//       ],
//     })
//   }

//   // --- Customer ---
//   const customer = await prisma.customer.create({
//     data: {
//       name: 'Nomadic Textile LLC',
//       abb_name: 'NomTex',
//       email: 'info@nomtex.mn',
//       mobile: '99998888',
//       address: 'Ulaanbaatar, Mongolia',
//     },
//   })

//   // --- Order + OrderProcess route ---
//   const order = await prisma.order.create({
//     data: {
//       order_no: 'ORD-001',
//       customer_id: customer.id,
//       recorded_at: new Date(),
//       color_id: 'white',
//       weight_kg: 1200,
//       status: OrderStatus.IN_PROGRESS,
//       owner_id: manager.id,
//       steps: {
//         create: processes.map((p, i) => ({
//           process_id: p.id,
//           seq: i + 1,
//         })),
//       },
//     },
//   })

//   // --- StageExecutions (simulate manufacturing flow) ---
//   const dyeingStage = await prisma.stageExecution.create({
//     data: {
//       order_id: order.id,
//       process_id: processes.find(p => p.code === 'P2_DYEING')!.id,
//       stage: StageType.FIBER_DYED,
//       status: ProcessStatus.DONE,
//       lot_num: 'LOT-2025-001',
//       pic_id1: operator.id,
//       started_at: new Date(),
//       finished_at: new Date(),
//     },
//   })

//   const blendingStage = await prisma.stageExecution.create({
//     data: {
//       order_id: order.id,
//       process_id: processes.find(p => p.code === 'P3_BLENDING')!.id,
//       stage: StageType.FIBER_BLENDED,
//       status: ProcessStatus.DONE,
//       batch_num: 1,
//       pic_id1: operator.id,
//       started_at: new Date(),
//       finished_at: new Date(),
//     },
//   })

//   // --- Outputs ---
//   const dyedOutput = await prisma.productionOutput.create({
//     data: {
//       order_id: order.id,
//       stage_exec_id: dyeingStage.id,
//       stage_type: StageType.FIBER_DYED,
//       recorded_at: new Date(),
//       fiber_type_id: 'wool',
//       color_id: 'grey',
//       lot_num: 'LOT-2025-001',
//       rough_weight_kg: 1200,
//       bale_weight_kg: 1180,
//       con_weight_kg: 1170,
//       moisture_pct: 8,
//       bobbin_type_id: 1,
//       bobbin_count: 8,
//       details: { note: 'Successfully dyed batch' },
//     },
//   })

//   const blendedOutput = await prisma.productionOutput.create({
//     data: {
//       order_id: order.id,
//       stage_exec_id: blendingStage.id,
//       stage_type: StageType.FIBER_BLENDED,
//       recorded_at: new Date(),
//       fiber_type_id: 'wool',
//       color_id: 'grey',
//       lot_num: 'LOT-2025-001',
//       batch_num: 1,
//       rough_weight_kg: 1180,
//       bale_weight_kg: 1160,
//       con_weight_kg: 1155,
//       moisture_pct: 7.5,
//       bobbin_type_id: 1,
//       bobbin_count: 10,
//       details: { note: 'Blending completed' },
//     },
//   })

//   // --- Waste ---
//   await prisma.waste.createMany({
//     data: [
//       {
//         order_id: order.id,
//         stage_exec_id: dyeingStage.id,
//         process_id: dyeingStage.process_id,
//         waste_type: WasteType.CLEAN_OCHES,
//         recorded_at: new Date(),
//         fiber_type_id: 'wool',
//         color_id: 'grey',
//         weight_kg: 15,
//         moisture_pct: 5,
//       },
//       {
//         order_id: order.id,
//         stage_exec_id: blendingStage.id,
//         process_id: blendingStage.process_id,
//         waste_type: WasteType.ERCHTEI,
//         recorded_at: new Date(),
//         fiber_type_id: 'wool',
//         color_id: 'grey',
//         weight_kg: 10,
//         moisture_pct: 5,
//       },
//     ],
//   })

//   // --- StockMoves ---
//   await prisma.stockMove.createMany({
//     data: [
//       {
//         order_id: order.id,
//         stage_exec_id: dyeingStage.id,
//         direction: MoveDir.IN,
//         qty_kg: 1200,
//         recorded_at: new Date(),
//         output_id: dyedOutput.id,
//       },
//       {
//         order_id: order.id,
//         stage_exec_id: dyeingStage.id,
//         direction: MoveDir.OUT,
//         qty_kg: 1180,
//         recorded_at: new Date(),
//         output_id: dyedOutput.id,
//       },
//       {
//         order_id: order.id,
//         stage_exec_id: blendingStage.id,
//         direction: MoveDir.OUT,
//         qty_kg: 1160,
//         recorded_at: new Date(),
//         output_id: blendedOutput.id,
//       },
//     ],
//   })

//   // --- Reservation (pre-allocate some stock to next order) ---
//   await prisma.reservation.create({
//     data: {
//       order_id: order.id,
//       output_id: blendedOutput.id,
//       qty_reserved_kg: 200,
//       status: ReservationStatus.ACTIVE,
//       reserved_at: new Date(),
//     },
//   })

//   console.log('✅ Seeding complete.')
// }

// main()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })



