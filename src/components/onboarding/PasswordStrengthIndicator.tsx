import React from 'react';

const getStrength = (password: string): number => {
  let score = 0;
  if (!password) return 0;

  const hasLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (hasLength) score++;
  if (hasLowercase && hasUppercase) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;
  if (password.length >= 12) score++;

  return score;
};

interface PasswordStrengthIndicatorProps {
  password?: string;
}

export const PasswordStrengthIndicator = ({ password = '' }: PasswordStrengthIndicatorProps) => {
  const score = getStrength(password);

  const strengthColors = [
    'bg-gray-200',    // 0
    'bg-red-500',     // 1
    'bg-orange-500',  // 2
    'bg-yellow-500',  // 3
    'bg-blue-500',    // 4
    'bg-green-500',   // 5
  ];

  const strengthText = [
    '',
    'Very Weak',
    'Weak',
    'Medium',
    'Strong',
    'Very Strong',
  ];

  const widthPercentage = score > 0 ? (score / 5) * 100 : 0;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strengthColors[score]}`}
            style={{ width: `${widthPercentage}%` }}
          />
        </div>
      </div>
      {password && <p className="text-sm text-muted-foreground">{strengthText[score]}</p>}
    </div>
  );
};