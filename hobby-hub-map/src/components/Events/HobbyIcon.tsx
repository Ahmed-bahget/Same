
import React from 'react';
import { Palette, Music2, Coffee, Gamepad, Monitor, Tent, Users, Activity } from 'lucide-react';

export type HobbyType = 'Sports' | 'Arts' | 'Music' | 'Cooking' | 'Gaming' | 'Tech' | 'Outdoor' | 'Social';

interface HobbyIconProps {
  hobbyType: HobbyType;
  className?: string;
}

const HobbyIcon: React.FC<HobbyIconProps> = ({ hobbyType, className }) => {
  const icons: Record<HobbyType, React.ComponentType<any>> = {
    Sports: Activity,
    Arts: Palette,
    Music: Music2,
    Cooking: Coffee,
    Gaming: Gamepad,
    Tech: Monitor,
    Outdoor: Tent,
    Social: Users,
  };

  const IconComponent = icons[hobbyType] || Users;
  return <IconComponent className={className} />;
};

export default HobbyIcon;
