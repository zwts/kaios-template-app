import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import cx from 'classnames';

import './index.scss';

export interface IProps {
  id?: number | string;
  l10nId: string;
  icon?: string;
  useIconFont?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button = forwardRef<HTMLDivElement, IProps>(
  (
    {
      id,
      l10nId,
      icon = null,
      useIconFont = true,
      danger = false,
      disabled = false,
    },
    btnRef
  ) => {
    const btnClasses = cx(
      'pill-button',
      { disabled: disabled },
      { danger: danger }
    );
    const focusable = !disabled ? { tabIndex: -1 } : null;

    return (
      <div
        data-id={id || l10nId}
        ref={btnRef}
        className={btnClasses}
        {...focusable}
      >
        {icon && useIconFont ? <i data-icon={icon} /> : null}
        {icon && !useIconFont ? <img src={icon} /> : null}
        <span data-l10n-id={l10nId} />
      </div>
    );
  }
);

export default Button;
