"use client";

import FriendRequestWizard from "./FriendRequestWizard";
import { type FriendforFriendListWithImgUrl } from "@/models/friends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { formatDateStringToDDMM } from "@/models/utils/timestamp";
import { trpc } from "@/lib/trpc/client";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "@/components/utils/default-toasts";
import { useState } from "react";

export default function FriendsRequests({
  friends,
  sentRequests,
  receivedRequests,
}: {
  friends: FriendforFriendListWithImgUrl[];
  sentRequests: FriendforFriendListWithImgUrl[];
  receivedRequests: FriendforFriendListWithImgUrl[];
}) {
  const [deletedFriendshipIds, setDeletedFriendshipIds] = useState<number[]>(
    []
  );
  const [acceptedFriendships, setAcceptedFriendships] = useState<
    FriendforFriendListWithImgUrl[]
  >([]);

  const { mutateAsync: cancelFriendRequest } =
    trpc.friendships.delete.useMutation({
      onSuccess: () => {
        toastDefaultSuccess("Friend request cancelled");
      },
      onError: () => {
        toastDefaultError("Failed to cancel friend request");
      },
    });

  const { mutateAsync: acceptFriendRequest } =
    trpc.friendships.acceptFriendRequest.useMutation({
      onSuccess: () => {
        toastDefaultSuccess("Friend request accepted");
      },
      onError: () => {
        toastDefaultError("Failed to accept friend request");
      },
    });

  const handleCancelRequest = (friendshipId: number) => {
    return cancelFriendRequest({ friendshipId }).then(() => {
      setDeletedFriendshipIds(friendships => [...friendships, friendshipId]);
    });
  };

  const handleAcceptRequest = (friendshipId: number) => {
    return acceptFriendRequest({ friendshipId }).then(() => {
      setAcceptedFriendships(friendships => [
        ...friendships,
        receivedRequests.find(
          f => f.id === friendshipId
        ) as FriendforFriendListWithImgUrl,
      ]);
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>

      <FriendRequestWizard />

      <Tabs defaultValue="friends" className="w-full p-3">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="friends">
            Friends
            <Badge variant="secondary" className="ml-2">
              {friends.length + acceptedFriendships.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            <Badge variant="secondary" className="ml-2">
              {sentRequests.length +
                receivedRequests.length -
                deletedFriendshipIds.length -
                acceptedFriendships.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="friends">
          <Card>
            <CardHeader>
              <CardTitle>Your Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] md:h-[600px]">
                <div className="space-y-4">
                  {friends.concat(acceptedFriendships).map(friend => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={friend.friend.img_url || undefined}
                            alt={friend.friend.username}
                          />
                          <AvatarFallback>
                            {friend.friend.username.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {friend.friend.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor={`${friend.created_at.toString()}`}>
                          Friend Since
                        </label>
                        <span
                          id={`${friend.created_at.toString()}`}
                          className="text-sm font-medium"
                        >
                          {formatDateStringToDDMM(friend.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Friend Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] md:h-[600px]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Sent Requests
                    </h3>
                    <div className="space-y-4">
                      {sentRequests
                        .filter(f => {
                          return !deletedFriendshipIds.includes(f.id);
                        })
                        .map(request => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage
                                  src={request.friend.img_url || undefined}
                                  alt={request.friend.username}
                                />
                                <AvatarFallback>
                                  {request.friend.username.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium leading-none">
                                  {request.friend.username}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                void handleCancelRequest(request.id)
                              }
                            >
                              Cancel
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Received Requests
                    </h3>
                    <div className="space-y-4">
                      {receivedRequests
                        .filter(f => {
                          return !acceptedFriendships
                            .map(f => f.id)
                            .includes(f.id);
                        })
                        .map(request => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage
                                  src={request.friend.img_url || undefined}
                                  alt={request.friend.username}
                                />
                                <AvatarFallback>
                                  {request.friend.username.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium leading-none">
                                  {request.friend.username}
                                </p>
                              </div>
                            </div>
                            <div className="space-x-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  void handleAcceptRequest(request.id)
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  void handleCancelRequest(request.id)
                                }
                              >
                                Decline
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
