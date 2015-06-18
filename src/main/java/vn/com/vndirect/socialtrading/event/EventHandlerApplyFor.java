package vn.com.vndirect.socialtrading.event;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

@Retention(RUNTIME)
@Target(TYPE)
public @interface EventHandlerApplyFor {
	int priority() default 10;
	String[] values() default { "" };
}
