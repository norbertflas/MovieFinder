// client/src/components/ui/Tooltip.js
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Przykład użycia biblioteki tooltip

export const Tooltip = ({ children }) => {
  return <ReactTooltip>{children}</ReactTooltip>;
};

export const TooltipContent = ({ children }) => {
  return <ReactTooltip.Content>{children}</ReactTooltip.Content>;
};

export const TooltipProvider = ({ children }) => {
  return <ReactTooltip.Provider>{children}</ReactTooltip.Provider>;
};

export const TooltipTrigger = ({ children }) => {
  return <ReactTooltip.Trigger>{children}</ReactTooltip.Trigger>;
};
