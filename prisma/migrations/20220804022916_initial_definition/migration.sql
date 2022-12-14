-- CreateTable
CREATE TABLE "Organization" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "orgId" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "referenceId" TEXT NOT NULL,
    "estimatedTimeArrival" TIMESTAMP(3),
    "currentOrganizationCodes" TEXT NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationsOnShipments" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "organizationCode" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "OrganizationsOnShipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgId_key" ON "Organization"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_referenceId_key" ON "Shipment"("referenceId");

-- AddForeignKey
ALTER TABLE "OrganizationsOnShipments" ADD CONSTRAINT "OrganizationsOnShipments_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("referenceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationsOnShipments" ADD CONSTRAINT "OrganizationsOnShipments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
