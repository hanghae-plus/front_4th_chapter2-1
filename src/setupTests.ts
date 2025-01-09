import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { beforeAll, afterAll, afterEach, expect } from "vitest";
import { server } from "@mocks/server";

expect.extend(matchers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
