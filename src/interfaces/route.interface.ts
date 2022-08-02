import express from 'express';

export interface RouteDefinition {
    configureRoutes(app: express.Application): express.Application;
}