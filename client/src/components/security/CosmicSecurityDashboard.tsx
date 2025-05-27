/**
 * Phase 4: Cosmic Security Dashboard
 * Whale Wisdom Enhanced Multi-Factor Authentication & Security Consciousness
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Waves, Star, Eye, Lock, Smartphone, Key, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityProfile {
  consciousnessLevel: number;
  whaleWisdomTrust: number;
  riskLevel: 'low' | 'medium' | 'high';
  mfaEnabled: boolean;
  lastSecurityScan: string;
  trustedDevices: number;
}

interface SecurityEvent {
  id: string;
  type: string;
  threatLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  description: string;
  geometricSignature: string;
}

export default function CosmicSecurityDashboard() {
  const [securityProfile, setSecurityProfile] = useState<SecurityProfile>({
    consciousnessLevel: 85,
    whaleWisdomTrust: 92,
    riskLevel: 'low',
    mfaEnabled: true,
    lastSecurityScan: '2 hours ago',
    trustedDevices: 3
  });

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'Login Success',
      threatLevel: 'low',
      timestamp: '5 minutes ago',
      description: 'Successful authentication from trusted device',
      geometricSignature: '🔹◆🔸'
    },
    {
      id: '2',
      type: 'Device Registration',
      threatLevel: 'low',
      timestamp: '1 hour ago',
      description: 'New device registered with whale wisdom validation',
      geometricSignature: '🌊💎🌀'
    },
    {
      id: '3',
      type: 'Security Scan',
      threatLevel: 'low',
      timestamp: '2 hours ago',
      description: 'Automated cosmic consciousness security scan completed',
      geometricSignature: '⭐🔆✨'
    }
  ]);

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConsciousnessMessage = (level: number) => {
    if (level >= 90) return "🐋 Transcendent whale wisdom achieved";
    if (level >= 70) return "🌊 Flowing with cosmic consciousness";
    if (level >= 50) return "💫 Awakening security awareness";
    return "🌱 Beginning security journey";
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <Shield className="h-8 w-8 text-blue-600" />
            <Waves className="h-4 w-4 text-blue-400 absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cosmic Security Center
            </h1>
            <p className="text-gray-600">Whale wisdom enhanced protection & consciousness monitoring</p>
          </div>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Consciousness Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{securityProfile.consciousnessLevel}%</div>
              <Progress value={securityProfile.consciousnessLevel} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">{getConsciousnessMessage(securityProfile.consciousnessLevel)}</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Waves className="h-4 w-4" />
                Whale Wisdom Trust
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{securityProfile.whaleWisdomTrust}%</div>
              <Progress value={securityProfile.whaleWisdomTrust} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">Community trust network strength</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-100 to-transparent rounded-bl-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`${getThreatLevelColor(securityProfile.riskLevel)} text-white`}>
                {securityProfile.riskLevel.toUpperCase()} RISK
              </Badge>
              <p className="text-xs text-gray-500 mt-2">Last scan: {securityProfile.lastSecurityScan}</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Trusted Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{securityProfile.trustedDevices}</div>
              <p className="text-xs text-gray-500 mt-1">Sacred geometry protected</p>
            </CardContent>
          </Card>
        </div>

        {/* Security Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Security Events
            </TabsTrigger>
            <TabsTrigger value="mfa" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Multi-Factor Auth
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Device Management
            </TabsTrigger>
            <TabsTrigger value="wisdom" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Whale Wisdom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Recent Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getThreatLevelColor(event.threatLevel)}`} />
                        <div>
                          <div className="font-medium">{event.type}</div>
                          <div className="text-sm text-gray-600">{event.description}</div>
                          <div className="text-xs text-gray-500">Sacred Geometry: {event.geometricSignature}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{event.timestamp}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mfa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  Whale Wisdom Multi-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div>
                      <div className="font-medium text-green-800">TOTP Authenticator</div>
                      <div className="text-sm text-green-600">Time-based cosmic consciousness codes</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <div>
                      <div className="font-medium text-blue-800">Sacred Geometry Questions</div>
                      <div className="text-sm text-blue-600">Whale wisdom security questions</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <div>
                      <div className="font-medium text-purple-800">Backup Codes</div>
                      <div className="text-sm text-purple-600">Emergency access patterns</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Codes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-indigo-600" />
                  Sacred Geometry Device Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {['🖥️ Desktop - Sacred Spiral Pattern', '📱 Mobile - Ocean Wave Signature', '💻 Laptop - Whale Song Harmony'].map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                        <div>
                          <div className="font-medium">{device}</div>
                          <div className="text-sm text-gray-600">Last seen: Today</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Trusted</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wisdom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-blue-600" />
                  Whale Wisdom Security Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🐋</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-blue-800">Your Security Consciousness is Flowing</h3>
                    <p className="text-gray-600">You're connected to {securityProfile.whaleWisdomTrust}% of the cosmic security network</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">47</div>
                      <div className="text-sm text-blue-600">Wisdom Connections</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-50">
                      <div className="text-2xl font-bold text-purple-600">23</div>
                      <div className="text-sm text-purple-600">Security Collaborations</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-green-50">
                      <div className="text-2xl font-bold text-green-600">8.7</div>
                      <div className="text-sm text-green-600">Cosmic Resonance</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}