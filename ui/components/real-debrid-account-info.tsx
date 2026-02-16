import { Chip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { debridUserQueryOptions } from "@/ui/utils/queryOptions";
import { AppErrorState, AppLoadingState } from "@/ui/components/primitives";

export const RealDebridAccountInfo = () => {
  const { data: user, isLoading, error, refetch } = useQuery(debridUserQueryOptions());

  if (isLoading) {
    return <AppLoadingState label="Loading account info" className="py-2" />;
  }

  if (error) {
    return (
      <AppErrorState
        message={error.message || "Failed to load account info"}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!user) {
    return <AppErrorState message="No account information available" />;
  }

  const getDaysRemainingColor = (expiration: string) => {
    const expirationDate = new Date(expiration);
    const now = new Date();
    const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) return "danger";
    if (daysRemaining < 8) return "warning";
    return "success";
  };

  const getDaysRemainingText = (expiration: string) => {
    const expirationDate = new Date(expiration);
    const now = new Date();
    const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) return "Expired";
    if (daysRemaining === 1) return "1 day";
    return `${daysRemaining} days`;
  };

  return (
    <div id="account-info" className="w-full max-w-md space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-foreground-500">Username:</span>
        <span className="text-sm text-foreground-500">{user.username}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-foreground-500">Points:</span>
        <span className="text-sm text-foreground-500">{user.points}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-foreground-500">Days Remaining:</span>
        <Chip color={getDaysRemainingColor(user.expiration)} variant="flat" size="sm">
          {getDaysRemainingText(user.expiration)}
        </Chip>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-foreground-500">Premium:</span>
        <Chip color={user.type === "premium" ? "success" : "danger"} variant="flat" size="sm">
          {user.type === "premium" ? "Active" : "Inactive"}
        </Chip>
      </div>
    </div>
  );
};
