import { Organization } from "src/types/types";

export interface OrganizationServiceDefinition {
    createOrUpdateOrganization(organization: Organization): void
}