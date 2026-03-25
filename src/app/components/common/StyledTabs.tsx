import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Tab {
  value: string;
  label: string;
  count?: number;
  content: React.ReactNode;
}

interface StyledTabsProps {
  tabs: Tab[];
  defaultValue?: string;
}

/**
 * Componente de abas estilizado com o tema Weliv
 */
export function StyledTabs({ tabs, defaultValue }: StyledTabsProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.value} className="w-full">
      <TabsList className="grid w-full mb-6" 
                style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFA500] data-[state=active]:to-[#FF8C00] data-[state=active]:text-white"
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20">
                {tab.count}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="mt-0">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
