-- CreateTable
CREATE TABLE "TransportPacks" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "TransportPacks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransportPacks" ADD CONSTRAINT "TransportPacks_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("referenceId") ON DELETE RESTRICT ON UPDATE CASCADE;
