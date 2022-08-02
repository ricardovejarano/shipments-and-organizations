import express from 'express';

export interface ControllerDefinition {
    configureRoutes(app: express.Application): express.Application;
}