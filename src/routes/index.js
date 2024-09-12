// ** admin routes **
import AddonRoutes from './admin/addon';
import AppRoutes from './admin/app';
import BannerRoutes from './admin/banner';
import BlogRoutes from './admin/blog';
import BookingZoneRoutes from './admin/booking-zone';
import BookingTimeRoutes from './admin/booking-time';
import BookingTableRoutes from './admin/booking-tables';
import BranchRoutes from './admin/branches';
import BrandRoutes from './admin/brand';
import CareerCategoryRoutes from './admin/career-category';
import CareerRoutes from './admin/career';
import CategoryImport from './admin/category';
import CouponRoutes from './admin/coupon';
import CurrencyRoutes from './admin/currency';
import DeliveryRoutes from './admin/deliveries';
import DiscountRoutes from './admin/discount';
import EmailProvidersRoutes from './admin/email-provider';
import ExtrasRoutes from './admin/extras';
import FaqRoutes from './admin/faq';
import FoodRoutes from './admin/food';
import GalleryRoutes from './admin/gallery';
import LanguagesRoutes from './admin/language';
import MessageSubscriber from './admin/message-subscriber';
import NotificationRoutes from './admin/notification';
import OrderRoutes from './admin/order';
import PagesRoutes from './admin/pages';
import PaymentPayloadRoutes from './admin/payment-payloads';
import BoxesCategoryRoutes from './admin/boxes-category';
import BoxesRoutes from './admin/boxes';
import RefundsRoutes from './admin/refunds';
import ReviewRoutes from './admin/reviews';
import SettingsRoutes from './admin/settings';
import ShopCategoryRoutes from './admin/shop-category';
import ShopTag from './admin/shop-tag';
import StoryRoutes from './admin/stories';
import SubscriptionsRoutes from './admin/subscriptions';
import UnitRoutes from './admin/unit';
import UsersRoutes from './admin/user';
import ReportRoutes from './admin/report';

// ** seller routes ** ----------------
import SellerAddonRoutes from './seller/addon';
import SellerAppRoutes from './seller/app';
import SellerBonusRoutes from './seller/bonus';
import SellerBookingZoneRoutes from './seller/booking-zone';
import SellerBookingTimeRoutes from './seller/booking-time';
import SellerBookingTableRoutes from './seller/booking-tables';
import SellerBoxesRoutes from './seller/boxes';
import SellerBranchRoutes from './seller/branch';
import SellerBrandRoutes from './seller/brand';
import SellerDiscountyRoutes from './seller/discount';
import SellerFoodRoutes from './seller/food';
import SellerGalleryRoutes from './seller/gallery';
import SellerOrderRoutes from './seller/order';
import SellerPaymentRoutes from './seller/payments';
import SellerReceptCategoryRoutes from './seller/recept-category';
import SellerRefundsRoutes from './seller/refunds';
import SellerReportRoutes from './seller/report';
import SellerReviewRoutes from './seller/reviews';
import SellerStoryRoutes from './seller/story';
import SellerSubscriptionsRoutes from './seller/subscriptions';

// ** waiter routes ** ----------------
import WaiterAppRoutes from './waiter/app';
import WaiterOrderRoutes from './waiter/order';

// ** Merge Routes
const AllRoutes = [
  ...AppRoutes,
  ...AddonRoutes,
  ...BannerRoutes,
  ...BlogRoutes,
  ...BookingZoneRoutes,
  ...BookingTimeRoutes,
  ...BookingTableRoutes,
  ...BrandRoutes,
  ...CareerCategoryRoutes,
  ...CareerRoutes,
  ...CategoryImport,
  ...CouponRoutes,
  ...CurrencyRoutes,
  ...DeliveryRoutes,
  ...DiscountRoutes,
  ...EmailProvidersRoutes,
  ...ExtrasRoutes,
  ...FaqRoutes,
  ...FoodRoutes,
  ...GalleryRoutes,
  ...LanguagesRoutes,
  ...MessageSubscriber,
  ...NotificationRoutes,
  ...OrderRoutes,
  ...PagesRoutes,
  ...PaymentPayloadRoutes,
  ...BoxesCategoryRoutes,
  ...BoxesRoutes,
  ...RefundsRoutes,
  ...ReviewRoutes,
  ...SettingsRoutes,
  ...ShopCategoryRoutes,
  ...ShopTag,
  ...StoryRoutes,
  ...SubscriptionsRoutes,
  ...UnitRoutes,
  ...UsersRoutes,
  ...ReportRoutes,
  ...BranchRoutes,

  // seller routes
  ...SellerAddonRoutes,
  ...SellerAppRoutes,
  ...SellerBrandRoutes,
  ...SellerBranchRoutes,
  ...SellerBonusRoutes,
  ...SellerBookingZoneRoutes,
  ...SellerBookingTimeRoutes,
  ...SellerBookingTableRoutes,
  ...SellerDiscountyRoutes,
  ...SellerFoodRoutes,
  ...SellerGalleryRoutes,
  ...SellerOrderRoutes,
  ...SellerRefundsRoutes,
  ...SellerReviewRoutes,
  ...SellerSubscriptionsRoutes,
  ...SellerReportRoutes,
  ...SellerPaymentRoutes,
  ...SellerReceptCategoryRoutes,
  ...SellerBoxesRoutes,
  ...SellerStoryRoutes,

  // waiter routes
  ...WaiterAppRoutes,
  ...WaiterOrderRoutes,
];

export { AllRoutes };
