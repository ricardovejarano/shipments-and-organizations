import { Organization } from "src/types/types";

export interface OrganizationServiceDefinition {
    saveOrganization(organization: Organization): void
}