import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslationProvider {
  private static ERROR_PREFIX = 'error-message';

  constructor(private readonly i18n: I18nService) {}

  error(key: string, params?: Record<string, unknown>): unknown {
    return this.translate(TranslationProvider.ERROR_PREFIX, key, params);
  }

  private translate(prefix: string, key: string, params?: Record<string, unknown>): unknown {
    return this.i18n.translate(prefix + '.' + key, { args: params, lang: I18nContext.current()?.lang });
  }
}
