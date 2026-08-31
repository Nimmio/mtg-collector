import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

import { getDatabaseUrl } from '../src/database-url.js'

const adapter = new PrismaPg({ connectionString: getDatabaseUrl() })
const prisma = new PrismaClient({ adapter })

const userId = 'seed-user-001'

async function main() {
  console.log('Seeding MTG Collector...')

  await prisma.collectionTransaction.deleteMany()
  await prisma.collectionItem.deleteMany()
  await prisma.storageLocation.deleteMany()
  await prisma.printing.deleteMany()
  await prisma.cardFace.deleteMany()
  await prisma.card.deleteMany()
  await prisma.user.deleteMany({ where: { id: userId } })

  const user = await prisma.user.create({ data: { id: userId } })
  const binder = await prisma.storageLocation.create({
    data: { userId: user.id, name: 'Trade Binder', description: 'Cards available for trade' },
  })
  const deckBox = await prisma.storageLocation.create({
    data: { userId: user.id, name: 'Commander Deck Box', description: 'Cards currently in decks' },
  })

  const lightning = await prisma.card.create({
    data: {
      scryfallOracleId: 'seed-oracle-lightning-bolt',
      name: 'Lightning Bolt',
      manaCost: '{R}',
      cmc: 1,
      typeLine: 'Instant',
      oracleText: 'Lightning Bolt deals 3 damage to any target.',
      colorIdentity: ['R'],
      colors: ['R'],
      keywords: [],
      producedMana: [],
      layout: 'normal',
      reserved: false,
      rawScryfallData: { source: 'seed' },
    },
  })
  const solRing = await prisma.card.create({
    data: {
      scryfallOracleId: 'seed-oracle-sol-ring',
      name: 'Sol Ring',
      manaCost: '{1}',
      cmc: 1,
      typeLine: 'Artifact',
      oracleText: '{T}: Add {C}{C}.',
      colorIdentity: [],
      colors: [],
      keywords: [],
      producedMana: ['C'],
      layout: 'normal',
      reserved: false,
      rawScryfallData: { source: 'seed' },
    },
  })

  const boltPrinting = await prisma.printing.create({
    data: {
      scryfallId: 'seed-printing-lightning-bolt',
      cardId: lightning.id,
      setCode: 'lea',
      setName: 'Limited Edition Alpha',
      collectorNumber: '161',
      rarity: 'common',
      lang: 'en',
      releasedAt: new Date('1993-08-05'),
      artist: 'Christopher Rush',
      borderColor: 'borderless',
      frame: '1993',
      imageStatus: 'missing',
      priceUsd: 12.5,
      priceUsdFoil: null,
      pricesUpdatedAt: new Date(),
      rawScryfallData: { source: 'seed' },
    },
  })
  const ringPrinting = await prisma.printing.create({
    data: {
      scryfallId: 'seed-printing-sol-ring',
      cardId: solRing.id,
      setCode: 'cmm',
      setName: 'Commander Masters',
      collectorNumber: '396',
      rarity: 'uncommon',
      lang: 'en',
      releasedAt: new Date('2023-08-04'),
      artist: 'Alayna Danner',
      borderColor: 'black',
      frame: '2015',
      imageStatus: 'missing',
      priceUsd: 2.75,
      priceUsdFoil: 8.25,
      pricesUpdatedAt: new Date(),
      rawScryfallData: { source: 'seed' },
    },
  })

  const boltItem = await prisma.collectionItem.create({
    data: {
      userId: user.id,
      printingId: boltPrinting.id,
      quantity: 2,
      condition: 'lightly_played',
      purchasePrice: 20,
      currentValue: 25,
      purchaseDate: new Date('2024-02-10'),
      locationId: binder.id,
      isForTrade: true,
      acquiredFrom: 'Local game store',
      notes: 'Alpha copies',
    },
  })
  const ringItem = await prisma.collectionItem.create({
    data: {
      userId: user.id,
      printingId: ringPrinting.id,
      quantity: 1,
      finish: 'foil',
      purchasePrice: 7.5,
      currentValue: 8.25,
      purchaseDate: new Date('2024-03-01'),
      locationId: deckBox.id,
      acquiredFrom: 'Commander Masters draft',
    },
  })

  await prisma.collectionTransaction.createMany({
    data: [
      { userId: user.id, collectionItemId: boltItem.id, type: 'purchase', quantity: 2, unitPrice: 10, occurredAt: new Date('2024-02-10'), counterparty: 'Local game store' },
      { userId: user.id, collectionItemId: ringItem.id, type: 'purchase', quantity: 1, unitPrice: 7.5, occurredAt: new Date('2024-03-01'), counterparty: 'Commander Masters draft' },
    ],
  })

  console.log('Seeded 1 user, 2 cards, 2 printings, 2 collection items, 2 locations, and 2 transactions.')
}

main().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
}).finally(() => prisma.$disconnect())
