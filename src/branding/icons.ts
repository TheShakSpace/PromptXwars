/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Cpu,
  Terminal,
  Database,
  Cuboid as Cube,
  Activity,
  Workflow,
  Sparkles,
  MessageSquare,
  Settings,
  HelpCircle,
  Folder,
  Sliders,
  Shield,
  Layers,
  FileText,
  Search,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Play,
  Moon,
  Sun,
  Eye,
  Info,
} from "lucide-react";

export const iconsMap: Record<string, React.ComponentType<any>> = {
  Cpu,
  Terminal,
  Database,
  Cube,
  Activity,
  Workflow,
  Sparkles,
  MessageSquare,
  Settings,
  HelpCircle,
  Folder,
  Sliders,
  Shield,
  Layers,
  FileText,
  Search,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Play,
  Moon,
  Sun,
  Eye,
  Info,
};

export function getIcon(name: string): React.ComponentType<any> {
  return iconsMap[name] || HelpCircle;
}
