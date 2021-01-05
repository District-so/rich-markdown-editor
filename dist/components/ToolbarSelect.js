"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
exports.default = styled_components_1.default.select `
  display: inline-block;
  flex: 0;

  ${props => props.active && "opacity: 1;"};
`;
//# sourceMappingURL=ToolbarSelect.js.map