import React from 'react';
import { Bell, BellRing, X, CheckCircle, AlertCircle, MessageSquare, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { mockListings, mockBlogArticles } from './mockData';
import { Page, ProfessionalListing, Feedback } from '../types';

interface NotificationSystemProps {
  onNavigate: (page: Page, params?: any) => void;
}

interface Notification {
  id: string;
  type: 'validation' | 'feedback' | 'listing' | 'article';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
}

export function NotificationSystem({ onNavigate }: NotificationSystemProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  // Générer les notifications basées sur les données
  React.useEffect(() => {
    const generateNotifications = () => {
      const notifs: Notification[] = [];

      // Fiches en attente de validation
      const pendingListings = mockListings.filter(listing => !listing.isApproved);
      pendingListings.forEach(listing => {
        notifs.push({
          id: `validation-${listing.id}`,
          type: 'validation',
          title: 'Nouvelle fiche à valider',
          description: `${listing.title} - ${listing.category}`,
          timestamp: listing.createdAt,
          isRead: false,
          data: { listingId: listing.id }
        });
      });

      // Feedbacks simulés (normalement viendraient de la base de données)
      const mockFeedbacks: Partial<Feedback>[] = [
        {
          id: 'f1',
          type: 'bug',
          title: 'Problème avec la recherche',
          description: 'La recherche ne fonctionne pas correctement sur mobile',
          userEmail: 'user@example.com',
          status: 'nouveau',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2h ago
        },
        {
          id: 'f2',
          type: 'suggestion',
          title: 'Amélioration de l\'interface',
          description: 'Ajouter un filtre par prix dans la recherche',
          userEmail: 'user2@example.com',
          status: 'nouveau',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5h ago
        }
      ];

      mockFeedbacks.forEach(feedback => {
        notifs.push({
          id: `feedback-${feedback.id}`,
          type: 'feedback',
          title: feedback.type === 'bug' ? 'Nouveau bug signalé' : 'Nouvelle suggestion',
          description: feedback.title!,
          timestamp: feedback.createdAt!,
          isRead: false,
          data: { feedbackId: feedback.id }
        });
      });

      // Trier par date (plus récent en premier)
      notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setNotifications(notifs);
    };

    generateNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case 'validation':
        onNavigate('admin');
        break;
      case 'feedback':
        onNavigate('admin');
        break;
      default:
        break;
    }
    
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'validation':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'feedback':
        return <MessageSquare className="w-4 h-4 text-orange-500" />;
      case 'listing':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'article':
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-6 text-xs"
                >
                  Tout marquer lu
                </Button>
              )}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium truncate">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

// Hook pour utiliser les notifications
export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    removeNotification,
    unreadCount
  };
}