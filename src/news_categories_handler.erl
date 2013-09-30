-module(news_categories_handler).
-author("shree@ybrantdigital.com").

-export([init/3]).

-export([content_types_provided/2]).
-export([welcome/2]).
-export([terminate/3]).

%% Init
init(_Transport, _Req, []) ->
	{upgrade, protocol, cowboy_rest}.

%% Callbacks
content_types_provided(Req, State) ->
	{[		
		{<<"text/html">>, welcome}	
	], Req, State}.

terminate(_Reason, _Req, _State) ->
	ok.

%% API
welcome(Req, State) ->
	{[{Name,Value}], Req2} = cowboy_req:bindings(Req),
	lager:info("News Category item with id : ~p requested", [binary_to_list(Value)]),
	Url = case binary_to_list(Value) of 
		"US" ->
			%Category = "US",
			enutv_util:news_category_url("us_news");
			
		"Politics" ->
			%Category = "Politics",
			enutv_util:news_category_url("us_politics");
			
		"Entertainment" ->
			%Category = "Entertainment",
			enutv_util:news_category_url("us_entertainment");
		
		"Markets" ->
			%Category = "Entertainment",
			enutv_util:news_category_url("us_markets");			

		"Money" ->
			%Category = "Entertainment",
			enutv_util:news_category_url("us_money");			
		_ ->

			%Category = "None",
			lager:info("#########################None")

	end,
	lager:info("Url is ~p", [Url]),
	%Url = wildridge_util:news_db_url(binary_to_list(Value)), 
	{ok, "200", _, Response} = ibrowse:send_req(Url,[],get,[],[]),
	Res = string:sub_string(Response, 1, string:len(Response) -1 ),
	Params = jsx:decode(list_to_binary(Res)),
	{value, {<<"rows">>, RowsList }}= lists:keysearch(<<"rows">>,1, Params),
	%Titles = [ Title || [_,_,{<<"value">>,[{<<"title">>,Title},_]}] <- RowsList ],
	Id_Title_Descriptions =  [ [{ <<"id">>, Id} , {<<"title">>, Title}, {<<"description">>,Description}] || [{_,Id},_,{<<"value">>,[{<<"title">>,Title},{_,Description}]}] <- RowsList ],
 
	lager:info("~p", [Id_Title_Descriptions]),
	{ok, Body} = news_categories_page_dtl:render([{<<"titles">>, Id_Title_Descriptions}]),

    {Body, Req2, State}.
    


