import { useCartStore } from '@/store/cart'
import { useCommonStore } from '@/store/common'
import { useCatalogStore } from '@/store/catalog'

export const useChangeLocation = (type, location, typeId = null) => {
  const cartStore = useCartStore()
  const commonStore = useCommonStore()
  const catalogStore = useCatalogStore();
  const { missedProductsList } = storeToRefs(cartStore)

  const warehouseId = location.warehouse_id

  let currentType = {};

  if (missedProductsList.value(warehouseId).length) {
    commonStore.setMissedProductsModal({
      type,
      location
    })
    return false
  }

  //Добавим к location код, название и цену доставки
  //TODO брать эту инфу из shipping_methods
  // немного отрефакторил (добавил получение имени из shipping_methods)
  switch (type) {
    case 'flat_rate':
      let price = 0;
      if (location?.value?.zone) {
        location.value?.zone.sum.forEach(item => {
          if (parseFloat(item.min_sum_order) <= parseFloat(cartItemsPrice.value)) {
            price = parseFloat(item.deliv_price)
          }
        })
      }

      currentType = commonStore.shipping_methods.find(item => item.id?.includes('flat_rate'));

      location.delivery_price = price;
      location.delivery_name = currentType?.name;
      location.delivery_code = currentType?.id;
      break;

    case 'local_pickup':
      currentType = commonStore.shipping_methods.find(item => item.id?.includes('local_pickup'));

      location.delivery_price = 0;
      location.delivery_name = currentType?.name;
      location.delivery_code = currentType?.id;
      break;

    case 'wcso_booking':
      currentType = commonStore.shipping_methods.find(item => item.id?.includes('wcso_booking'));

      location.delivery_price = 0;
      location.delivery_name = currentType?.name;
      location.delivery_code = currentType?.id;
      break;

    default:
      break;
  }

  commonStore.setDeliveryType(type, typeId)
  commonStore.setLocation(location)
  if (commonStore.fragmentedCatalog) {
    catalogStore.getCatalogByLocation();
    catalogStore.isShowLoader = true;
  }
  if (commonStore.popups) {
    commonStore.toggleShowPopupModal(true);
  }
  setTimeout(() => {
    cartStore.getDiscounts()
  }, 2000)

  return true
}