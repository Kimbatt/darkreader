import {m} from 'malevic';
import {CheckBox, TimeRangePicker} from '../../../controls';
import {getLocalMessage} from '../../../../utils/locales';
import {ExtWrapper} from '../../../../definitions';

type MoreToggleSettingsProps = ExtWrapper & {
    isExpanded: boolean;
    onClose: () => void;
};

export default function MoreToggleSettings({data, actions, isExpanded, onClose}: MoreToggleSettingsProps) {
    const locationSettings = data.settings.location;
    const values = {
        'latitude': {
            min: -90,
            max: 90
        },
        'longitude': {
            min: -180,
            max: 180,
        }
    }

    function getLocationString(location: number) {
        if (location === undefined) {
            return '';
        }

        return location.toString() + '°';
    }

    function locationChanged(inputElement: HTMLInputElement, newValue: string, type: string) {
        if (newValue.trim() === '') {
            inputElement.value = '';
            locationSettings[type] = undefined;

            actions.changeSettings({
                location: locationSettings
            });

            return;
        }

        const min: number = values[type].min;
        const max: number = values[type].max;

        newValue = newValue.replace(',', '.').replace('°', '');

        let num = Number(newValue);
        if (isNaN(num)) {
            num = 0;
        } else if (num > max) {
            num = max;
        } else if (num < min) {
            num = min;
        }

        inputElement.value = getLocationString(num);
        locationSettings[type] = num;

        actions.changeSettings({
            location: locationSettings
        });
    }

    return (
        <div
            class={{
                'header__app-toggle__more-settings': true,
                'header__app-toggle__more-settings--expanded': isExpanded,
            }}
        >
            <div class="header__app-toggle__more-settings__top">
                <span class="header__app-toggle__more-settings__top__text">{getLocalMessage('time_settings')}</span>
                <span class="header__app-toggle__more-settings__top__close" role="button" onclick={onClose}>✕</span>
            </div>
            <div class="header__app-toggle__more-settings__content">
                <div class="header__app-toggle__more-settings__line">
                    <CheckBox
                        checked={data.settings.automation === 'time'}
                        onchange={(e) => actions.changeSettings({automation: e.target.checked ? 'time' : ''})}
                    />
                    <TimeRangePicker
                        startTime={data.settings.time.activation}
                        endTime={data.settings.time.deactivation}
                        onChange={([start, end]) => actions.changeSettings({time: {activation: start, deactivation: end}})}
                    />
                </div>
                <p class="header__app-toggle__more-settings__description">
                    {getLocalMessage('set_active_hours')}
                </p>
                <div class="header__app-toggle__more-settings__line">
                    <CheckBox
                        checked={data.settings.automation === 'sunset'}
                        onchange={(e) => actions.changeSettings({automation: e.target.checked ? 'sunset' : ''})}
                    />
                    <input
                        class="textbox time-range-picker__input time-range-picker__input--start"
                        placeholder={getLocalMessage('latitude')}
                        onchange={(e) => locationChanged(e.target, e.target.value, 'latitude')}
                        attached={(node: HTMLInputElement) => node.value = getLocationString(locationSettings.latitude)}
                        onkeypress={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur();
                            }
                        }}
                    />
                    <input
                        class="textbox time-range-picker__input time-range-picker__input--end"
                        placeholder={getLocalMessage('longitude')}
                        onchange={(e) => locationChanged(e.target, e.target.value, 'longitude')}
                        attached={(node: HTMLInputElement) => node.value = getLocationString(locationSettings.longitude)}
                        onkeypress={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur();
                            }
                        }}
                    />
                </div>
                <p class="header__app-toggle__more-settings__sunset-description">
                    {getLocalMessage('set_location')}
                </p>
            </div>
        </div>
    );
}
