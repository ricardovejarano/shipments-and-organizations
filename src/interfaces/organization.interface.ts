import { Organization } from "src/types/types";
import { Organization as OrganizationPrisma } from '.prisma/client';

export interface OrganizationServiceDefinition {
    createOrUpdateOrganization(organization: Organization): Promise<OrganizationPrisma>;
    getOrganizationById(orgId: string): Promise<Organization | undefined>
}