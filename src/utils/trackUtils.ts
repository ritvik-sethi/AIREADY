import { Crown, Users, Briefcase, Code, Book as BookIcon, Star } from 'lucide-react';

export interface TrackColorClasses {
  bg: string;
  text: string;
  border: string;
}

/**
 * Get icon component based on track icon name
 */
export const getTrackIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    crown: Crown,
    users: Users,
    briefcase: Briefcase,
    code: Code,
    book: BookIcon,
  };
  return icons[iconName] || Star;
};

/**
 * Get CSS module class names based on track color
 * Returns class names that match the CSS module naming convention
 */
export const getTrackColorClasses = (color: string): TrackColorClasses => {
  const colors: { [key: string]: TrackColorClasses } = {
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  };
  return colors[color] || colors.purple;
};

