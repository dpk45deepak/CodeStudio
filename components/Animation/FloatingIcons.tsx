import React from 'react';
import {
  SiNodedotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiExpress,
  SiNestjs,
  SiNextdotjs,
  SiPrisma,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiJest,
  SiWebpack,
  SiBabel,
  SiGraphql,
  SiApollographql,
  SiSocketdotio,
  SiPassport,
  SiJsonwebtokens,
  SiNginx,
  SiAwsamplify,
  SiFirebase,
  SiTailwindcss,
  SiRedux,
  SiVite,
  SiEsbuild,
  SiFastify,
  SiKoa,
  SiMysql,
  SiSqlite,
  SiRabbitmq,
  SiElasticsearch,
  SiNpm,
  SiYarn,
  SiPnpm,
  SiGithubactions,
  SiKubernetes,
  SiTerraform,
  SiPrometheus,
  SiGrafana,
  SiStorybook,
  SiTestinglibrary,
  SiCypress,
} from 'react-icons/si';

import {
  FaJava,
  FaPython,
  FaRust,
  FaDocker
} from 'react-icons/fa';

import { 
  VscVscode,
  VscTerminal
} from 'react-icons/vsc';

// Type definitions
type IconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

interface IconItem {
  name: string;
  icon: IconComponent;
  category: 'framework' | 'database' | 'tool' | 'language' | 'devops' | 'testing' | 'runtime';
  size?: 'sm' | 'md' | 'lg';
}

// Predefined icon categories with proper typing
const NODE_ICONS: IconItem[] = [
  // Runtimes & Languages
  { name: 'Node.js', icon: SiNodedotjs, category: 'runtime' },
  { name: 'TypeScript', icon: SiTypescript, category: 'language' },
  { name: 'JavaScript', icon: SiJavascript, category: 'language' },
  { name: 'Java', icon: FaJava, category: 'language' },
  { name: 'Python', icon: FaPython, category: 'language' },
  { name: 'Rust', icon: FaRust, category: 'language' },
  
  // Backend Frameworks
  { name: 'Express', icon: SiExpress, category: 'framework' },
  { name: 'NestJS', icon: SiNestjs, category: 'framework' },
  { name: 'Fastify', icon: SiFastify, category: 'framework' },
  { name: 'Koa', icon: SiKoa, category: 'framework' },
  { name: 'Next.js', icon: SiNextdotjs, category: 'framework' },
  { name: 'Socket.io', icon: SiSocketdotio, category: 'framework' },
  
  // Databases
  { name: 'MongoDB', icon: SiMongodb, category: 'database' },
  { name: 'PostgreSQL', icon: SiPostgresql, category: 'database' },
  { name: 'MySQL', icon: SiMysql, category: 'database' },
  { name: 'SQLite', icon: SiSqlite, category: 'database' },
  { name: 'Redis', icon: SiRedis, category: 'database' },
  { name: 'Elasticsearch', icon: SiElasticsearch, category: 'database' },
  
  // ORMs & Query Builders
  { name: 'Prisma', icon: SiPrisma, category: 'tool' },
  
  // DevOps & Containerization
  { name: 'Docker', icon: FaDocker, category: 'devops' },
  { name: 'Kubernetes', icon: SiKubernetes, category: 'devops' },
  { name: 'Nginx', icon: SiNginx, category: 'devops' },
  { name: 'GitHub Actions', icon: SiGithubactions, category: 'devops' },
  { name: 'Terraform', icon: SiTerraform, category: 'devops' },
  
  // Cloud Services
  { name: 'AWS', icon: SiAwsamplify, category: 'devops' },
  { name: 'Firebase', icon: SiFirebase, category: 'devops' },
  
  // Message Queues
  { name: 'RabbitMQ', icon: SiRabbitmq, category: 'tool' },
  
  // Authentication
  { name: 'Passport', icon: SiPassport, category: 'tool' },
  { name: 'JWT', icon: SiJsonwebtokens, category: 'tool' },
  
  // Frontend
  { name: 'React', icon: SiReact, category: 'framework' },
  { name: 'Redux', icon: SiRedux, category: 'framework' },
  { name: 'TailwindCSS', icon: SiTailwindcss, category: 'framework' },
  
  // GraphQL
  { name: 'GraphQL', icon: SiGraphql, category: 'framework' },
  { name: 'Apollo', icon: SiApollographql, category: 'framework' },
  
  // Build Tools
  { name: 'Webpack', icon: SiWebpack, category: 'tool' },
  { name: 'Vite', icon: SiVite, category: 'tool' },
  { name: 'Babel', icon: SiBabel, category: 'tool' },
  { name: 'esbuild', icon: SiEsbuild, category: 'tool' },
  
  // Package Managers
  { name: 'npm', icon: SiNpm, category: 'tool' },
  { name: 'Yarn', icon: SiYarn, category: 'tool' },
  { name: 'pnpm', icon: SiPnpm, category: 'tool' },
  
  // Testing
  { name: 'Jest', icon: SiJest, category: 'testing' },
  { name: 'Testing Library', icon: SiTestinglibrary, category: 'testing' },
  { name: 'Cypress', icon: SiCypress, category: 'testing' },

  // Monitoring & Observability
  { name: 'Prometheus', icon: SiPrometheus, category: 'devops' },
  { name: 'Grafana', icon: SiGrafana, category: 'devops' },
  
  // Development Tools
  { name: 'VS Code', icon: VscVscode, category: 'tool' },
  { name: 'Terminal', icon: VscTerminal, category: 'tool' },
  { name: 'Storybook', icon: SiStorybook, category: 'tool' },
];

// Type-safe helper function to get icons by category
const getIconsByCategory = (category: IconItem['category']): IconItem[] => {
  return NODE_ICONS.filter(item => item.category === category);
};

// Type-safe helper function to get random icons
const getRandomIcons = (count: number): IconItem[] => {
  const shuffled = [...NODE_ICONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Type-safe size mapping
const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
} as const;

interface FloatingIconsProps {
  icons?: IconItem[];
  count?: number;
  maxOpacity?: number;
  iconSize?: keyof typeof sizeMap;
  categories?: IconItem['category'][];
  animationDelay?: number;
  className?: string;
}

const FloatingIcons: React.FC<FloatingIconsProps> = ({ 
  icons,
  count = 20,
  maxOpacity = 0.2,
  iconSize = 'lg',
  categories,
  animationDelay = 6,
  className = ''
}) => {
  // Determine which icons to use
  const iconsToRender = React.useMemo(() => {
    if (icons) return icons;
    if (categories) {
      return categories.flatMap(category => getIconsByCategory(category));
    }
    return getRandomIcons(count);
  }, [icons, categories, count]);

  return (
    <div className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}>
      {iconsToRender.map((item, index) => {
        // Generate random positions for each icon
        const randomTop = Math.random() * 90;
        const randomLeft = Math.random() * 90;
        const randomDelay = Math.random() * animationDelay;
        const randomDuration = 15 + Math.random() * 10; // Random duration between 15-25s
        
        // Get the icon component
        const IconComponent = item.icon;
        
        return (
          <div
            key={`${item.name}-${index}`}
            className="icon-float absolute animate-float flex items-center justify-center"
            style={{
              top: `${randomTop}%`,
              left: `${randomLeft}%`,
              animationDelay: `${randomDelay}s`,
              animationDuration: `${randomDuration}s`,
              opacity: maxOpacity,
            }}
          >
            <IconComponent 
              className={`${sizeMap[iconSize]}`}
              style={{ 
                filter: 'none',
                isolation: 'isolate'
              } as React.CSSProperties}
            />
          </div>
        );
      })}
    </div>
  );
};

// Export types and utilities for use in other components
export type { IconItem, IconComponent };
export { NODE_ICONS, getIconsByCategory, getRandomIcons, sizeMap };
export default FloatingIcons;