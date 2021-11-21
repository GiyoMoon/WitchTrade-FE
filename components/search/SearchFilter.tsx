import { FunctionComponent, useState } from 'react';
import Image from 'next/image';
import useThemeProvider from '../../shared/providers/theme.provider';
import { inventoryValues, itemCharacterValues, itemEventValues, itemSlotValues, orderDirectionValues, tradeableItemRarityValues, tradeableOrderByValues } from '../../shared/handlers/filter.handler';
import Dropdown from '../styles/Dropdown';
import CheckboxInput from '../styles/CheckboxInput';
import useInventoryProvider from '../../shared/providers/inventory.provider';
import ActionButton from '../styles/ActionButton';
import Loading from '../styles/Loading';
import { createDefaultSearchFilter, SearchFilterValues, SearchOrderValues } from '../../shared/handlers/search.handler';
import useUserProvider from '../../shared/providers/user.provider';

interface Props {
  searchFilterValues: SearchFilterValues;
  setSearchFilterValues: (searchFilterValues: SearchFilterValues) => void;
  searchOrderValues: SearchOrderValues;
  setSearchOrderValues: (searchOrderValues: SearchOrderValues) => void;
  initialOpen: boolean;
  search: () => void;
  searchInProgress: boolean;
};

const SearchFilter: FunctionComponent<Props> = ({ searchFilterValues, setSearchFilterValues, searchOrderValues, setSearchOrderValues, initialOpen, search, searchInProgress }) => {
  const { theme } = useThemeProvider();

  const { user } = useUserProvider();
  const { inventory } = useInventoryProvider();

  const [filterOpen, setFilterOpen] = useState(initialOpen);

  const clearFilter = () => {
    setSearchFilterValues(createDefaultSearchFilter());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-wt-surface-dark rounded-lg">
        <div className="flex p-2 rounded-lg justify-between cursor-pointer hover:bg-wt-hover" onClick={() => setFilterOpen(!filterOpen)}>
          <Image src={`/assets/svgs/expand_${filterOpen ? 'less' : 'more'}/${theme?.type === 'light' ? 'black' : 'white'}.svg`} height="20px" width="20px" alt="Dropdown Item Icon" />
          <p className="font-semibold">Filter</p>
          <Image src={`/assets/svgs/expand_${filterOpen ? 'less' : 'more'}/${theme?.type === 'light' ? 'black' : 'white'}.svg`} height="20px" width="20px" alt="Dropdown Item Icon" />
        </div>
        {filterOpen &&
          <div className="flex flex-col items-center p-2">
            <div className="flex flex-wrap justify-center">
              <div className="m-1" style={{ width: '220px' }}>
                <p className="mb-1">Character</p>
                <Dropdown selectedValue={searchFilterValues.itemCharacter} setValue={(itemCharacter) => setSearchFilterValues({ ...searchFilterValues, itemCharacter })} values={itemCharacterValues} />
              </div>
              <div className="m-1" style={{ width: '220px' }}>
                <p className="mb-1">Slot</p>
                <Dropdown selectedValue={searchFilterValues.itemSlot} setValue={(itemSlot) => setSearchFilterValues({ ...searchFilterValues, itemSlot })} values={itemSlotValues} />
              </div>
              <div className="m-1" style={{ width: '220px' }}>
                <p className="mb-1">Event</p>
                <Dropdown selectedValue={searchFilterValues.itemEvent} setValue={(itemEvent) => setSearchFilterValues({ ...searchFilterValues, itemEvent })} values={itemEventValues} />
              </div>
              <div className="m-1" style={{ width: '220px' }}>
                <p className="mb-1">Rarity</p>
                <Dropdown selectedValue={searchFilterValues.itemRarity} setValue={(itemRarity) => setSearchFilterValues({ ...searchFilterValues, itemRarity })} values={tradeableItemRarityValues} />
              </div>
            </div>
            {inventory.id &&
              <>
                <div className="m-1" style={{ width: '220px' }}>
                  <p className="mb-1">Inventory</p>
                  <Dropdown selectedValue={searchFilterValues.inventory} setValue={(inventory) => setSearchFilterValues({ ...searchFilterValues, inventory })} values={inventoryValues} />
                </div>
                <div className="m-2">
                  <CheckboxInput placeholder="Show duplicates only" value={searchFilterValues.duplicatesOnly} setValue={(duplicatesOnly) => setSearchFilterValues({ ...searchFilterValues, duplicatesOnly })} />
                </div>
              </>
            }
            {user.id &&
              <div className="m-2">
                <CheckboxInput placeholder="Only Items on my wishlist" value={searchFilterValues.wishlistOnly} setValue={(wishlistOnly) => setSearchFilterValues({ ...searchFilterValues, wishlistOnly })} />
              </div>
            }
            <div className="flex flex-wrap justify-center">
              <div className="m-1" style={{ width: '220px' }}>
                <p className="mb-1">Order by</p>
                <Dropdown selectedValue={searchOrderValues.orderBy} setValue={(orderBy) => setSearchOrderValues({ ...searchOrderValues, orderBy })} values={tradeableOrderByValues} />
              </div>
              <div className="m-1" style={{ width: '220px' }}>
                <p className="mb-1">Show in</p>
                <Dropdown selectedValue={searchOrderValues.orderDirection} setValue={(orderDirection) => setSearchOrderValues({ ...searchOrderValues, orderDirection })} values={orderDirectionValues} />
              </div>
            </div>
            <div className="mt-2">
              <ActionButton type="cancel" onClick={clearFilter}>
                <Image src="/assets/svgs/bin/white.svg" height="24px" width="24px" alt="Clear filter" />
                Clear Filter
              </ActionButton>
            </div>
            <div className="mt-2">
              {!searchInProgress &&
                <ActionButton type="proceed" onClick={search}>
                  <Image src="/assets/svgs/search.svg" height="24px" width="24px" alt="Search" />
                  Search
                </ActionButton>
                ||
                <Loading text="Searching..." />
              }
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default SearchFilter;
