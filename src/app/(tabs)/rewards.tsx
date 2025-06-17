/* eslint-disable prettier/prettier */
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Reward = {
  id: number;
  title: string;
  points: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description?: string;
  available?: boolean;
  cost?: number;
  type?: "daily" | "achievement" | "event" | "vip";
  rarity?: "common" | "rare" | "epic" | "legendary";
  progress?: number;
  maxProgress?: number;
};

export default function RewardsScreen() {
  const [userPoints, setUserPoints] = useState(2847);
  const [selectedTab, setSelectedTab] = useState<"daily" | "battle" | "spin">(
    "daily"
  );
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [vipLevel, setVipLevel] = useState(3);
  const [battlePassLevel, setBattlePassLevel] = useState(15);
  const [spinCoins, setSpinCoins] = useState(3);

  const [spinAnimation] = useState(new Animated.Value(0));
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [wonReward, setWonReward] = useState<Reward | null>(null);

  // Reset spin animation when tab changes
  useEffect(() => {
    spinAnimation.setValue(0);
  }, [selectedTab]);

  const dailyRewards: Reward[] = [
    {
      id: 1,
      title: "Day 1",
      points: 50,
      icon: "star",
      color: "#f59e0b",
      type: "daily",
      rarity: "common",
    },
    {
      id: 2,
      title: "Day 2",
      points: 75,
      icon: "star",
      color: "#f59e0b",
      type: "daily",
      rarity: "common",
    },
    {
      id: 3,
      title: "Day 3",
      points: 100,
      icon: "star",
      color: "#f59e0b",
      type: "daily",
      rarity: "rare",
    },
    {
      id: 4,
      title: "Day 4",
      points: 125,
      icon: "star",
      color: "#f59e0b",
      type: "daily",
      rarity: "common",
    },
    {
      id: 5,
      title: "Day 5",
      points: 150,
      icon: "star",
      color: "#f59e0b",
      type: "daily",
      rarity: "epic",
    },
    {
      id: 6,
      title: "Day 6",
      points: 175,
      icon: "star",
      color: "#f59e0b",
      type: "daily",
      rarity: "common",
    },
    {
      id: 7,
      title: "Day 7",
      points: 500,
      icon: "diamond",
      color: "#f59e0b",
      type: "daily",
      rarity: "legendary",
    },
  ];

  const battlePassRewards: Reward[] = [
    {
      id: 1,
      title: "Level 1",
      points: 100,
      icon: "trophy",
      color: "#f59e0b",
      type: "event",
      rarity: "common",
      progress: 100,
      maxProgress: 100,
    },
    {
      id: 2,
      title: "Level 5",
      points: 250,
      icon: "trophy",
      color: "#f59e0b",
      type: "event",
      rarity: "rare",
      progress: 100,
      maxProgress: 100,
    },
    {
      id: 3,
      title: "Level 10",
      points: 500,
      icon: "trophy",
      color: "#f59e0b",
      type: "event",
      rarity: "epic",
      progress: 100,
      maxProgress: 100,
    },
    {
      id: 4,
      title: "Level 15",
      points: 1000,
      icon: "trophy",
      color: "#f59e0b",
      type: "event",
      rarity: "legendary",
      progress: 60,
      maxProgress: 100,
    },
  ];

  const vipRewards: Reward[] = [
    {
      id: 1,
      title: "VIP 1",
      points: 0,
      icon: "diamond",
      color: "#f59e0b",
      type: "vip",
      rarity: "rare",
      description: "Daily bonus points +10%",
    },
    {
      id: 2,
      title: "VIP 2",
      points: 0,
      icon: "diamond",
      color: "#f59e0b",
      type: "vip",
      rarity: "epic",
      description: "Daily bonus points +25%",
    },
    {
      id: 3,
      title: "VIP 3",
      points: 0,
      icon: "diamond",
      color: "#f59e0b",
      type: "vip",
      rarity: "legendary",
      description: "Daily bonus points +50%",
    },
  ];

  const spinRewards: Reward[] = [
    {
      id: 1,
      title: "50 Points",
      points: 50,
      icon: "star",
      color: "#f59e0b",
      rarity: "common",
    },
    {
      id: 2,
      title: "100 Points",
      points: 100,
      icon: "star",
      color: "#f59e0b",
      rarity: "common",
    },
    {
      id: 3,
      title: "200 Points",
      points: 200,
      icon: "star",
      color: "#f59e0b",
      rarity: "rare",
    },
    {
      id: 4,
      title: "500 Points",
      points: 500,
      icon: "star",
      color: "#f59e0b",
      rarity: "epic",
    },
    {
      id: 5,
      title: "1000 Points",
      points: 1000,
      icon: "star",
      color: "#f59e0b",
      rarity: "legendary",
    },
  ];

  const handleRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (selectedReward) {
      setUserPoints(userPoints + selectedReward.points);
      setShowRedeemModal(false);
      setSelectedReward(null);
    }
  };

  const getRarityColor = (rarity: Reward["rarity"]) => {
    switch (rarity) {
      case "common":
        return "#6b7280";
      case "rare":
        return "#3b82f6";
      case "epic":
        return "#8b5cf6";
      case "legendary":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const handleSpin = () => {
    if (spinCoins > 0) {
      setSpinCoins(spinCoins - 1);
      // Animate spin
      Animated.sequence([
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Random reward
        const randomReward =
          spinRewards[Math.floor(Math.random() * spinRewards.length)];
        setWonReward(randomReward);
        setShowRewardAnimation(true);
        setTimeout(() => {
          setShowRewardAnimation(false);
          setWonReward(null);
        }, 2000);
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Header with Game-like Design */}
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        className="px-6 pt-14 pb-6"
      >
        <View className="items-center">
          <View className="flex-row items-center mb-4">
            <Ionicons name="trophy" size={32} color="#f59e0b" />
            <Text className="text-white text-3xl font-bold ml-2">
              Rewards Center
            </Text>
          </View>
          <View className="flex-row items-center space-x-4">
            <LinearGradient
              colors={["#f59e0b", "#d97706"]}
              className="px-6 py-3 rounded-full border-2 border-yellow-400"
            >
              <View className="flex-row items-center">
                <Ionicons name="star" size={24} color="white" />
                <Text className="text-white text-xl font-bold ml-2">
                  {userPoints.toLocaleString()}
                </Text>
              </View>
            </LinearGradient>
            <LinearGradient
              colors={["#8b5cf6", "#6d28d9"]}
              className="px-6 py-3 rounded-full border-2 border-purple-400"
            >
              <View className="flex-row items-center">
                <Ionicons name="diamond" size={24} color="white" />
                <Text className="text-white text-xl font-bold ml-2">
                  VIP {vipLevel}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigation with Game-like Design */}
      <View className="px-6 mt-6">
        <View className="bg-slate-800 p-1 rounded-2xl flex-row border border-slate-700">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${selectedTab === "daily" ? "bg-gradient-to-r from-blue-500 to-blue-600" : ""}`}
            onPress={() => setSelectedTab("daily")}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="calendar"
                size={20}
                color={selectedTab === "daily" ? "white" : "#6b7280"}
              />
              <Text
                className={`ml-2 font-semibold ${selectedTab === "daily" ? "text-white" : "text-gray-400"}`}
              >
                Daily
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${selectedTab === "battle" ? "bg-gradient-to-r from-purple-500 to-purple-600" : ""}`}
            onPress={() => setSelectedTab("battle")}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="trophy"
                size={20}
                color={selectedTab === "battle" ? "white" : "#6b7280"}
              />
              <Text
                className={`ml-2 font-semibold ${selectedTab === "battle" ? "text-white" : "text-gray-400"}`}
              >
                Battle Pass
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${selectedTab === "spin" ? "bg-gradient-to-r from-yellow-500 to-yellow-600" : ""}`}
            onPress={() => setSelectedTab("spin")}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="gift"
                size={20}
                color={selectedTab === "spin" ? "white" : "#6b7280"}
              />
              <Text
                className={`ml-2 font-semibold ${selectedTab === "spin" ? "text-white" : "text-gray-400"}`}
              >
                Lucky Spin
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content based on selected tab */}
      <View className="px-6 mt-6">
        {selectedTab === "daily" && (
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-bold">
                Daily Rewards
              </Text>
              <View className="bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500">
                <Text className="text-blue-400 font-bold">Day 3/7</Text>
              </View>
            </View>
            <View className="flex-row flex-wrap justify-between">
              {dailyRewards.map((reward) => (
                <TouchableOpacity
                  key={reward.id}
                  className="w-[30%] mb-4"
                  onPress={() => handleRedeem(reward)}
                >
                  <LinearGradient
                    colors={["#1a1a2e", "#16213e"]}
                    className="p-4 rounded-2xl items-center border border-slate-700"
                  >
                    <View
                      className="p-3 rounded-full mb-2 border-2"
                      style={{
                        backgroundColor: getRarityColor(reward.rarity),
                        borderColor:
                          reward.rarity === "legendary"
                            ? "#f59e0b"
                            : "transparent",
                      }}
                    >
                      <Ionicons name={reward.icon} size={24} color="white" />
                    </View>
                    <Text className="text-white font-semibold text-center">
                      {reward.title}
                    </Text>
                    <Text className="text-gray-400 text-sm text-center">
                      {reward.points} Points
                    </Text>
                    {reward.rarity === "legendary" && (
                      <View className="absolute -top-2 -right-2">
                        <Ionicons name="flash" size={20} color="#f59e0b" />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedTab === "battle" && (
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-bold">Battle Pass</Text>
              <View className="bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500">
                <Text className="text-purple-400 font-bold">
                  Level {battlePassLevel}
                </Text>
              </View>
            </View>
            {battlePassRewards.map((reward) => (
              <View
                key={reward.id}
                className="bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-700"
              >
                <View className="flex-row items-center">
                  <View
                    className="p-3 rounded-full mr-4 border-2"
                    style={{
                      backgroundColor: getRarityColor(reward.rarity),
                      borderColor:
                        reward.rarity === "legendary"
                          ? "#f59e0b"
                          : "transparent",
                    }}
                  >
                    <Ionicons name={reward.icon} size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-base">
                      {reward.title}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {reward.points} points
                    </Text>
                  </View>
                  <View className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500">
                    <Text className="text-green-400 font-bold text-sm">
                      {reward.progress}%
                    </Text>
                  </View>
                </View>
                <View className="bg-slate-700 rounded-full h-2 mt-3">
                  <LinearGradient
                    colors={["#3b82f6", "#60a5fa"]}
                    className="rounded-full h-2"
                    style={{
                      width: `${((reward.progress || 0) / (reward.maxProgress || 100)) * 100}%`,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === "spin" && (
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-bold">Lucky Spin</Text>
              <View className="bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500">
                <Text className="text-yellow-400 font-bold">
                  {spinCoins} Spins
                </Text>
              </View>
            </View>
            <View className="bg-slate-800 rounded-3xl p-6 items-center mb-6 border border-slate-700">
              <Animated.View
                className="w-64 h-64 rounded-full border-4 border-yellow-500 items-center justify-center mb-4"
                style={{
                  transform: [
                    {
                      rotate: spinAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <Text className="text-white text-2xl font-bold">
                  SPIN TO WIN!
                </Text>
              </Animated.View>
              <TouchableOpacity
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-3 rounded-full border-2 border-yellow-400"
                onPress={handleSpin}
                disabled={spinCoins === 0}
              >
                <Text className="text-white font-bold text-lg">SPIN NOW</Text>
              </TouchableOpacity>
            </View>

            {/* Won Reward Animation */}
            {showRewardAnimation && wonReward && (
              <View className="absolute inset-0 items-center justify-center bg-black/80">
                <View className="bg-slate-800 p-6 rounded-3xl items-center border-2 border-yellow-500">
                  <View
                    className="p-4 rounded-full mb-4 border-2"
                    style={{
                      backgroundColor: getRarityColor(wonReward.rarity),
                      borderColor:
                        wonReward.rarity === "legendary"
                          ? "#f59e0b"
                          : "transparent",
                    }}
                  >
                    <Ionicons name={wonReward.icon} size={32} color="white" />
                  </View>
                  <Text className="text-white text-xl font-bold mb-2">
                    Congratulations!
                  </Text>
                  <Text className="text-yellow-400 text-lg font-bold">
                    {wonReward.title}
                  </Text>
                </View>
              </View>
            )}

            <Text className="text-white text-lg font-bold mb-4">
              Possible Rewards
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {spinRewards.map((reward) => (
                <View key={reward.id} className="w-[30%] mb-4">
                  <LinearGradient
                    colors={["#1a1a2e", "#16213e"]}
                    className="p-4 rounded-2xl items-center border border-slate-700"
                  >
                    <View
                      className="p-3 rounded-full mb-2 border-2"
                      style={{
                        backgroundColor: getRarityColor(reward.rarity),
                        borderColor:
                          reward.rarity === "legendary"
                            ? "#f59e0b"
                            : "transparent",
                      }}
                    >
                      <Ionicons name={reward.icon} size={24} color="white" />
                    </View>
                    <Text className="text-white font-semibold text-center">
                      {reward.title}
                    </Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Redeem Modal with Game-like Design */}
      <Modal
        visible={showRedeemModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRedeemModal(false)}
      >
        <View className="flex-1 bg-black/80 items-center justify-center">
          <View className="bg-slate-800 rounded-3xl p-6 w-[80%] border-2 border-slate-700">
            <Text className="text-white text-xl font-bold text-center mb-4">
              Redeem Reward
            </Text>
            {selectedReward && (
              <>
                <View className="items-center mb-4">
                  <View
                    className="p-4 rounded-full mb-2 border-2"
                    style={{
                      backgroundColor: selectedReward.color,
                      borderColor:
                        selectedReward.rarity === "legendary"
                          ? "#f59e0b"
                          : "transparent",
                    }}
                  >
                    <Ionicons
                      name={selectedReward.icon}
                      size={32}
                      color="white"
                    />
                  </View>
                  <Text className="text-white text-lg font-bold">
                    {selectedReward.title}
                  </Text>
                  <Text className="text-gray-400 text-center mt-2">
                    {selectedReward.description}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="flex-1 bg-slate-700 py-3 rounded-xl mr-2 border border-slate-600"
                    onPress={() => setShowRedeemModal(false)}
                  >
                    <Text className="text-white text-center font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 py-3 rounded-xl ml-2 border border-blue-400"
                    onPress={confirmRedeem}
                  >
                    <Text className="text-white text-center font-semibold">
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <View className="h-8" />
    </ScrollView>
  );
}
