import { useState, useEffect } from 'react';
import { getPasswordStrength } from '../utils/validation';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState({ level: 'weak', color: 'red', label: 'Weak' });

  useEffect(() => {
    if (password) {
      setStrength(getPasswordStrength(password));
    } else {
      setStrength({ level: 'weak', color: 'red', label: 'Weak' });
    }
  }, [password]);

  const getColorClasses = (color) => {
    switch (color) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getWidthClass = (level) => {
    switch (level) {
      case 'weak':
        return 'w-1/3';
      case 'medium':
        return 'w-2/3';
      case 'strong':
        return 'w-full';
      default:
        return 'w-0';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getColorClasses(strength.color)} ${getWidthClass(strength.level)}`}
        />
      </div>
      <p className={`text-xs mt-1 font-medium text-${strength.color}-600`}>
        Password Strength: {strength.label}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
